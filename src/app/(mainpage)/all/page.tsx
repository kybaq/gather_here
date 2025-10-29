import { Suspense } from 'react';
import AllContent from '@/components/MainPage/PageContent/AllContent';

const AllPage = () => {
  return (
    <Suspense>
      <AllContent />
    </Suspense>
  );
};

export default AllPage;
