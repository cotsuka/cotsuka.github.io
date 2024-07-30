---
title: 'Removing a Drive from a Btrfs Array'
date: 2023-07-05
permalink: 'articles/2023-07-05-removing-a-drive-from-a-btrfs-array/'
modified: 2024-01-26
description: If a drive is failing in an array, Btrfs could block attempts at removing the drive due to corrupted files. A quick write-up of how to get it removed.
tags:
- linux
---

I recently ran into a situation where I knew one of the hard drives in my Btrfs array was failing. Simply following the [Btrfs wiki removing devices instructions](https://archive.kernel.org/oldwiki/btrfs.wiki.kernel.org/index.php/Using_Btrfs_with_Multiple_Devices.html#Removing_devices) was unsuccessful as the `btrfs delete device` command would throw an error, cancelling the device deletion process.

At this point, I was okay with losing any corrupted/unrecoverable files. You should already be past the point of restoring from backup, attempting other recovery methods, etc. I just wanted to get the dying drive removed from the array since I knew I didn't have critical data on the array.

> **Warning**
>
> Make sure you've exhausted all other resources before continuing. Check the [ArchWiki](https://wiki.archlinux.org/title/Btrfs), [Btrfs mailing list](https://archive.kernel.org/oldwiki/btrfs.wiki.kernel.org/index.php/Btrfs_mailing_list.html), etc. This will lead to data loss!

### Scrub the Array
Start a scrub to identify files blocking the device from getting deleted:

```console
[cameron@host ~]$ sudo btrfs scrub start /mnt/btrfs
```

The scrub will take a while. In my case, it took nearly 27 hours:

```console
[cameron@host ~]$ sudo btrfs scrub status /mnt/btrfs
UUID:             16df0a0e-1dad-439f-aee1-f9961122fe59
Scrub started:    Tue Jul  4 11:27:56 2023
Status:           finished
Duration:         26:55:47
Total to scrub:   31.20TiB
Rate:             338.01MiB/s
Error summary:    read=256
    Corrected:      238
    Uncorrectable:  18
    Unverified:     0
```

### Remove Uncorrectable Errors
Btrfs was able to correct many of the errors it came across, but in this instance I was left with 18 uncorrectable errors. As the scrub identifies these, it will report them into the kernel ring buffer (`dmesg`). I found it nearly impossible to search through that, since the messages would either fall out of the log by the time I came back to the terminal to search. Instead, `journalctl` keeps a full enough history to search through:

```console
[cameron@host ~]$ sudo journalctl --dmesg --grep 'unable to fixup'
Jul 04 13:56:48 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 32574079762432 on dev /dev/sdd physical 1251936043008
Jul 04 13:58:27 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 32615643807744 on dev /dev/sdd physical 1265582800896
Jul 04 14:15:53 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092168253440 on dev /dev/sdd physical 1424279666688
Jul 04 14:16:08 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092168646656 on dev /dev/sdd physical 1424280059904
Jul 04 14:16:08 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092168515584 on dev /dev/sdd physical 1424279928832
Jul 04 14:16:23 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092169498624 on dev /dev/sdd physical 1424280911872
Jul 04 14:16:23 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092169760768 on dev /dev/sdd physical 1424281174016
Jul 04 14:16:30 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092169891840 on dev /dev/sdd physical 1424281305088
Jul 04 14:16:45 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092171005952 on dev /dev/sdd physical 1424282419200
Jul 04 14:16:45 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092171137024 on dev /dev/sdd physical 1424282550272
Jul 04 14:16:53 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092172382208 on dev /dev/sdd physical 1424283795456
Jul 04 14:17:00 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092201283584 on dev /dev/sdd physical 1424312696832
Jul 04 14:17:07 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092202528768 on dev /dev/sdd physical 1424313942016
Jul 04 14:17:19 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092203773952 on dev /dev/sdd physical 1424315187200
Jul 04 14:17:19 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092203773952 on dev /dev/sdd physical 1424315187200
Jul 04 14:17:26 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092205019136 on dev /dev/sdd physical 1424316432384
Jul 04 14:17:38 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092209999872 on dev /dev/sdd physical 1424321413120
Jul 04 14:17:38 host kernel: BTRFS error (device sdh): unable to fixup (regular) error at logical 33092209999872 on dev /dev/sdd physical 1424321413120
```

Now we need to translate those logicals into files we can actually attempt removing:

```console
[cameron@host ~]$ sudo btrfs inspect-internal logical-resolve 32574079762432 /mnt/btrfs
/mnt/btrfs/P6300090.mov
```

The output shows logical `32574079762432` refers to `/mnt/btrfs/P6300090.mov`. Remove the file, doing the same for all other logicals reported as uncorrectable errors. Several of the errors I received seemed to go away/not refer to a file. I just attempted removing any files that were identified, ignoring logicals that didn't resolve to anything.

### Delete the Device
Now remount the Btrfs array, marking it as degraded. Then, delete the device you want to remove (in my case `/dev/sdd`):

```console
[cameron@host ~]$ sudo mount -o degraded /dev/sdd /mnt/btrfs
[cameron@host ~]$ sudo btrfs device delete /dev/sdd /mnt/btrfs
```

The device deletion will also take a while, but now you should see the used data total on the device you're deleting reduce over time:

```console
[cameron@host ~]$ sudo btrfs fi show
Label: none  uuid: 16df0a0e-1dad-439f-aee1-f9961122fe59
        Total devices 7 FS bytes used 31.16TiB
        devid    1 size 14.55TiB used 13.96TiB path /dev/sdh
        devid    2 size 0.00B used 962.01GiB path /dev/sdd
        devid    3 size 12.73TiB used 12.14TiB path /dev/sda
        devid    4 size 12.73TiB used 1.05TiB path /dev/sdb
        devid    5 size 12.73TiB used 1.05TiB path /dev/sdc
        devid    6 size 12.73TiB used 1.05TiB path /dev/sdf
        devid    7 size 12.73TiB used 1.05TiB path /dev/sdg
```

And here's the same a while later:

```console
[cameron@host ~]$ sudo btrfs fi show
Label: none  uuid: 16df0a0e-1dad-439f-aee1-f9961122fe59
        Total devices 7 FS bytes used 31.16TiB
        devid    1 size 14.55TiB used 13.96TiB path /dev/sdh
        devid    2 size 0.00B used 874.01GiB path /dev/sdd
        devid    3 size 12.73TiB used 12.14TiB path /dev/sda
        devid    4 size 12.73TiB used 1.07TiB path /dev/sdb
        devid    5 size 12.73TiB used 1.07TiB path /dev/sdc
        devid    6 size 12.73TiB used 1.07TiB path /dev/sdf
        devid    7 size 12.73TiB used 1.07TiB path /dev/sdg
```

Let that complete, and the device should now be removed from the Btrfs array. You're now missing several files that were unrecoverable, so hopefully those were backed up somewhere else or they weren't critical.