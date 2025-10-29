'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/provider/user/UserAuthProvider';
import { fetchLikedPosts } from '@/lib/fetchPosts';
import PostCardLong from '@/components/Common/Card/PostCard/PostCardLong';
import ItEventCardShort from '@/components/Common/Card/PostCard/ItEventCardShort';
import MypageList from '@/components/Common/Skeleton/MypageList';
import Pagination from '@/components/MyPage/Common/Pagination';
import { PostWithUser, ITEvent } from '@/types/posts/Post.type';

type Tab = '전체' | '스터디' | '프로젝트' | 'IT 행사';

const InterestsTap: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<Tab>('전체');
  const [posts, setPosts] = useState<(PostWithUser | ITEvent)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const postsPerPage = 6;

  useEffect(() => {
    const loadPosts = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const likedPosts = await fetchLikedPosts(user.id);

          const filteredPosts = likedPosts.filter((post: PostWithUser | ITEvent) => {
            if (selectedTab === '전체') return true;
            if (selectedTab === 'IT 행사' && 'event_id' in post) return true;
            if (selectedTab !== 'IT 행사' && 'category' in post && post.category === selectedTab) return true;
            return false;
          });

          setPosts(filteredPosts);
          setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
        } catch (error) {
          console.error('포스트 불러오는 중 오류 발생:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    void loadPosts();
  }, [user, selectedTab]);

  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRemoveBookmark = (postId: string | number) => {
    setPosts(prevPosts =>
      prevPosts.filter(post => (post as PostWithUser).post_id !== postId && (post as ITEvent).event_id !== postId),
    );
  };

  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="relative flex flex-col">
      <div className="sticky z-10 s:relative s:top-auto">
        <div className="flex w-[320px] s:w-full items-center m:justify-start s:justify-center space-x-4 s:space-x-6 p-3 bg-fillStrong rounded-2xl">
          <button
            className={`text-baseS min-w-[60px] ${selectedTab === '전체' ? 'tab-button' : ''}`}
            onClick={() => handleTabClick('전체')}
          >
            전체
          </button>
          <button
            className={`text-baseS min-w-[60px] ${selectedTab === '스터디' ? 'tab-button' : ''}`}
            onClick={() => handleTabClick('스터디')}
          >
            스터디
          </button>
          <button
            className={`text-baseS min-w-[64px] ${selectedTab === '프로젝트' ? 'tab-button' : ''}`}
            onClick={() => handleTabClick('프로젝트')}
          >
            프로젝트
          </button>
          <button
            className={`text-baseS min-w-[64px] ${selectedTab === 'IT 행사' ? 'tab-button' : ''}`}
            onClick={() => handleTabClick('IT 행사')}
          >
            <span className="sm:hidden">IT행사</span>
            <span className="hidden sm:inline">IT 행사</span>
          </button>
        </div>
      </div>
      <div className="s:w-full mt-5 grid gap-5 s:grid-cols-1 m:grid-cols-2 grid-cols-3">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, index) => <MypageList key={index} />)
        ) : currentPosts.length > 0 ? (
          currentPosts.map(post => (
            <div
              key={(post as PostWithUser).post_id || (post as ITEvent).event_id}
              className="s:w-full h-[261px] mb-4 sm:mb-0"
            >
              {'event_id' in post ? (
                <ItEventCardShort post={post} onRemoveBookmark={() => handleRemoveBookmark(post.event_id)} />
              ) : (
                <PostCardLong post={post} onRemoveBookmark={() => handleRemoveBookmark(post.post_id)} />
              )}
            </div>
          ))
        ) : (
          <p className="mt-8 text-center text-labelNeutral col-span-full">북마크 한 글이 아직 없어요.🥺</p>
        )}
      </div>
      <div className="flex justify-center py-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default InterestsTap;
