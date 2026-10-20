import getContentStaticPaths from '@utils/getContentStaticPaths';

export { GET } from '@utils/getEntryOpenGraphImage';
export const getStaticPaths = getContentStaticPaths('articles', true);
