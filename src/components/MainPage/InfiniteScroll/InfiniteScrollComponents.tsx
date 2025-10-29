'use client';

import InfiniteScroll from 'react-infinite-scroll-component';
import PostCardLong from '@/components/Common/Card/PostCard/PostCardLong';
import AdCard from '@/components/MainPage/AdCard/AdCard';
import { PostWithUser } from '@/types/posts/Post.type';
import SpinnerLoader from '@/components/Common/Loading/SpinnerLoader';
import InitialLoadingWrapper from '@/components/Common/Loading/InitialLoadingWrapper';
import { Fragment } from 'react/jsx-runtime';

interface InfiniteScrollComponentProps {
  posts: PostWithUser[];
  hasMore: boolean;
  loadMorePosts: () => Promise<void>;
}

const InfiniteScrollComponent: React.FC<InfiniteScrollComponentProps> = ({ posts = [], hasMore, loadMorePosts }) => {
  return (
    <InitialLoadingWrapper>
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'white' }}>해당 조건에 맞는 게시물이 없습니다</p>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center items-center w-full">
              <SpinnerLoader />
            </div>
          }
          endMessage={<p style={{ textAlign: 'center', color: 'white' }}>모든 포스트를 불러왔습니다</p>}
        >
          {posts.map((post, index) => (
            <Fragment key={`${post.post_id}_${index}`}>
              <PostCardLong post={post} />
              {(index + 1) % 5 === 0 && <AdCard key={`ad_${index}`} />}
            </Fragment>
          ))}
        </InfiniteScroll>
      )}
    </InitialLoadingWrapper>
  );
};

export default InfiniteScrollComponent;
