'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/provider/user/UserAuthProvider';
import { fetchPosts } from '@/lib/fetchPosts';
import PostCardLong from '@/components/Common/Card/PostCard/PostCardLong';
import MypageList from '@/components/Common/Skeleton/MypageList';
import Pagination from '@/components/MyPage/Common/Pagination';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { PostWithUser } from '@/types/posts/Post.type';

type Tab = '전체' | '스터디' | '프로젝트';

const PostsTap: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<Tab>('전체');
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);
  const postsPerPage = 6;

  // 게시글 데이터 로딩
  useEffect(() => {
    const loadPosts = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          let allPosts: PostWithUser[] = [];
          let page = 1;
          let hasMore = true;

          // 유저 ID 기반 전체 게시글 페이지네이션으로 반복 fetch
          while (hasMore) {
            const userPosts = await fetchPosts(
              page,
              undefined,
              { user_id: user.id },
              { order: { column: 'created_at', ascending: false } },
            );

            if (userPosts.length === 0) {
              hasMore = false;
            } else {
              allPosts = [...allPosts, ...userPosts];
              page++;
            }
          }

          setPosts(allPosts);
          updateTotalPages(allPosts);
        } catch (error) {
          console.error('포스트 불러오는 중 오류 발생:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    void loadPosts();
  }, [user]);

  // 전체 페이지 수 업데이트
  const updateTotalPages = (filteredPosts: PostWithUser[]) => {
    setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
  };

  // 탭 클릭 시 선택된 탭과 현재 페이지 초기화
  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
    updateTotalPages(filterPosts(posts, tab));
  };

  // 페이지 번호 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 선택된 탭에 따른 게시글 필터링
  const filterPosts = (allPosts: PostWithUser[], tab: Tab) => {
    if (tab === '전체') return allPosts;
    return allPosts.filter(post => post.category === tab);
  };

  // 현재 페이지 기준으로 보여줄 게시글 슬라이싱
  const getCurrentPosts = () => {
    const filteredPosts = filterPosts(posts, selectedTab);
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  };

  // 게시글 수정 페이지로 이동
  const handleEdit = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  // 게시글 삭제 실행
  const handleDelete = async () => {
    if (postIdToDelete) {
      try {
        const { error } = await supabase.from('Posts').delete().eq('post_id', postIdToDelete);
        if (error) {
          console.error('게시물 삭제 실패:', error);
        } else {
          const updatedPosts = posts.filter(post => post.post_id !== postIdToDelete);
          setPosts(updatedPosts);
          updateTotalPages(filterPosts(updatedPosts, selectedTab));
        }
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
      } finally {
        setIsModalOpen(false);
        setPostIdToDelete(null);
      }
    }
  };

  // 삭제 모달 오픈
  const confirmDelete = (postId: string) => {
    setPostIdToDelete(postId);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-65 text-center z-50">
          <div className="relative min-w-[300px] m:min-w-[260px] p-6 bg-fillStrong rounded-lg shadow-lg z-60">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="모달 닫기"
            >
              <Image src="/assets/header/close.svg" alt="닫기 버튼" width={16} height={16} />
            </button>
            <h2 className="mb-2 text-subtitle font-semibold text-labelStrong">정말 삭제하시겠어요?</h2>
            <div className="mb-5">
              <p className="text-labelNeutral text-baseS">삭제하면 다시 복구할 수 없어요.</p>
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="shared-button-gray w-1/2 !text-primary"
                aria-label="게시물 삭제 취소"
              >
                취소할래요
              </button>
              <button
                onClick={() => void handleDelete()}
                className="shared-button-green w-1/2"
                aria-label="게시물 삭제"
              >
                삭제할래요
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sticky z-10 s:relative s:top-auto">
        <div className="flex w-[250px] s:w-full items-center m:justify-start s:justify-center space-x-4 s:space-x-6 p-3 bg-fillStrong rounded-2xl">
          <button
            className={`text-baseS min-w-[64px] ${selectedTab === '전체' ? 'tab-button' : ''}`}
            onClick={() => handleTabClick('전체')}
          >
            전체
          </button>
          <button
            className={`text-baseS min-w-[64px] ${selectedTab === '스터디' ? 'tab-button' : ''}`}
            onClick={() => handleTabClick('스터디')}
          >
            스터디
          </button>
          <button
            className={`text-baseS min-w-[66px] ${selectedTab === '프로젝트' ? 'tab-button' : ''}`}
            onClick={() => handleTabClick('프로젝트')}
          >
            프로젝트
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="s:w-full mt-5 grid s:grid-cols-1 m:grid-cols-2 grid-cols-3 gap-6">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, index) => <MypageList key={index} />)
          ) : getCurrentPosts().length > 0 ? (
            getCurrentPosts().map(post => (
              <div key={post.post_id} className="s:w-full h-[261px] relative group mb-4 sm:mb-0">
                <PostCardLong post={post} />
                {user?.id === post.user_id && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-2xl">
                    <button
                      onClick={() => handleEdit(post.post_id)}
                      className="m-2 p-3 bg-fillLight rounded-full hover:bg-fillNormal"
                    >
                      <Image
                        src="/assets/header/write.svg"
                        alt="호버시 수정 버튼"
                        width={17}
                        height={17}
                        className="w-6 h-6"
                      />
                    </button>
                    <button
                      onClick={() => confirmDelete(post.post_id)}
                      className="m-2 p-3 bg-fillLight rounded-full hover:bg-fillNormal"
                    >
                      <Image
                        src="/assets/delete.svg"
                        alt="호버시 삭제 버튼"
                        width={22}
                        height={22}
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="mt-8 text-center text-labelNeutral col-span-full">작성된 글이 없어요. 🥺</p>
          )}
        </div>
      </div>
      <div className="mt-auto flex justify-center py-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default PostsTap;
