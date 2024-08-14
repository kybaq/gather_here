"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/provider/UserContextProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { useModal } from "@/provider/ContextProvider";
// import { useRouter } from "next/navigation";

const ProfileInfo: React.FC = () => {
  // const { openModal, closeModal } = useModal();
  // const router = useRouter();
  const supabase = createClient();
  const router = useRouter();
  const { user, userData, fetchUserData } = useUser();
  const [nickname, setNickname] = useState("");
  const [blog, setBlog] = useState("");
  const [job, setJob] = useState("");
  const [experience, setExperience] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname ?? "");
      setBlog(userData.blog ?? "");
      setJob(userData.job_title ?? "");
      setExperience(userData.experience ?? "");
    }
  }, [userData]);

  const validateForm = () => {
    let valid = true;
    // 닉네임 유효성 검사
    if (nickname.length < 2 || nickname.length > 11) {
      setNicknameError("닉네임은 2-11자가 아닙니다.");
      valid = false;
    } else {
      setNicknameError("");
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user?.email ?? "")) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      valid = false;
    } else {
      setEmailError("");
    }

    return valid;
  };

  // 사용자 정보 업데이트
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    const { error } = await supabase
      .from("Users")
      .update({ nickname, blog, job_title: job, experience })
      .eq("user_id", user.id);

    if (error) {
      console.error("사용자 정보 업데이트 에러:", error);
      toast.error("완료되지 않았습니다.");
    } else {
      toast.success("정보가 업데이트되었습니다.");
      fetchUserData();
    }
  };

  // 취소 버튼 클릭 시 모달 열기
  const handleReset = () => {
    setIsCancelModalOpen(true);
  };

  // 취소 모달 나갈래요
  const handleConfirmLeave = () => {
    setIsCancelModalOpen(false);
    if (userData) {
      setNickname(userData.nickname ?? "");
      setBlog(userData.blog ?? "");
      setJob(userData.job_title ?? "");
      setExperience(userData.experience ?? "");
    }
    router.push("/");
  };

  // 취소 모달에서 '마저 쓸래요' 클릭 시 처리
  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  // 회원 탈퇴 기능 (추후 작업예정)
  // const handleDeleteAccount = async () => {
  //   if (!user) return;

  //   try {
  //     const { error: deleteError } = await supabase.from("Users").delete().eq("user_id", user.id);
  //     if (deleteError) throw deleteError;

  //     const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
  //     if (authError) throw authError;

  //     await supabase.auth.signOut();
  //     router.push("/");
  //   } catch (error) {
  //     console.error("회원 탈퇴 중 오류 발생:", error);
  //     toast.error("회원 탈퇴 중 오류가 발생했습니다.");
  //   }
  // };

  // 회원 탈퇴 모달 열기
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // 회원 탈퇴 모달 닫기
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // 모달 UI 렌더링 - 취소 모달
  const renderCancelModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-65 text-center z-50">
      <div className="relative min-w-[340px] m:min-w-[300px] p-6 bg-fillStrong rounded-lg shadow-lg z-60">
        <h2 className="mb-2 text-lg font-baseBold text-fontWhite">수정 중인 내용이 있어요.</h2>
        <p className="text-labelNeutral text-baseS mb-5">이 화면을 나가시면 변경한 내용이 저장되지 않아요.</p>
        <div className="flex justify-center space-x-2">
          <button onClick={handleCloseCancelModal} className="shared-button-gray w-1/2">
            마저 쓸래요
          </button>
          <button onClick={handleConfirmLeave} className="shared-button-green w-1/2">
            나갈래요
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <fieldset className="p-6 s:p-0">
          <h1 className="text-subtitle font-baseBold text-labelNeutral mb-5">기본 정보</h1>
          <div className="grid grid-cols-2 m:grid-cols-1 gap-10 pb-11 border-b-[1px] border-fillNormal">
            <div>
              <label htmlFor="email" className="block text-sm text-labelDisabled font-medium mb-1">
                이메일
              </label>
              <input
                type="text"
                id="email"
                name="email"
                disabled
                value={user?.email ?? ""}
                className="w-full shared-input-gray-2 border-[1px] border-fillLight"
                style={{ color: "#454545" }}
              />
              {emailError && <p className="text-statusDestructive text-baseXs mt-1">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="nickname" className="block text-baseS text-labelNormal font-medium mb-1">
                닉네임 <span className="text-statusDestructive ml-1">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요."
                className="w-full shared-input-gray-2 border-[1px] border-fillLight"
              />
              <p className="text-labelAssistive text-baseXs mt-1">닉네임은 2-11자 내로 작성해주세요.</p>
              {nicknameError && <p className="text-statusDestructive text-baseXs mt-1">{nicknameError}</p>}
            </div>
            <div className="mt-[-13px] s:mt-0">
              <label htmlFor="job" className="block text-sm font-medium text-labelNormal mb-1">
                직군 <span className="text-statusDestructive ml-1">*</span>
              </label>
              <select
                id="job"
                name="job"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full shared-select-gray-2 border-[1px] border-fillLight"
              >
                <option value="">선택해주세요</option>
                <option value="프론트엔드">프론트엔드</option>
                <option value="백엔드">백엔드</option>
                <option value="디자이너">디자이너</option>
                <option value="IOS">IOS</option>
                <option value="안드로이드">안드로이드</option>
                <option value="데브옵스">데브옵스</option>
                <option value="PM">PM</option>
                <option value="기획자">기획자</option>
                <option value="마케팅">마케팅</option>
              </select>
            </div>
            <div className="mt-[-13px] s:mt-0">
              <label htmlFor="experience" className="block text-sm font-medium text-labelNormal mb-1">
                경력<span className="text-statusDestructive ml-1">*</span>
              </label>
              <select
                id="experience"
                name="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full shared-select-gray-2 border-[1px] border-fillLight"
              >
                <option value="">선택해주세요</option>
                <option value="1년 미만">1년 미만</option>
                <option value="1년">1년</option>
                <option value="2년">2년</option>
                <option value="3년">3년</option>
                <option value="4년">4년</option>
                <option value="5년">5년</option>
                <option value="6년">6년</option>
                <option value="7년">7년</option>
                <option value="8년 이상">8년 이상</option>
              </select>
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-1 text-labelNormal">
                URL&nbsp;<span className="text-labelAssistive text-baseXs">(선택)</span>
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={blog}
                onChange={(e) => setBlog(e.target.value)}
                placeholder="링크를 입력해주세요."
                className="w-full shared-input-gray-2 border-[1px] border-fillLight"
              />
              <p className="text-labelAssistive text-baseXs mt-1">
                자신을 나타낼 수 있는 포트폴리오 링크를 알려주세요.
              </p>
            </div>
          </div>
          <div className="mt-6 mb-12">
            {/* mvp 이후 */}
            {/* <button type="button" aria-label="회원 탈퇴하기" onClick={handleOpenDeleteModal} className="mb-6 hover:underline">
              탈퇴하기
            </button> */}
            <div className="s:fixed flex s:justify-center s:bottom-0 s:left-0 s:right-0 s:p-4 s:bg-background s:z-10">
              <div className="flex justify-end s:justify-center gap-2 w-full s:max-w-container-s">
                <button
                  type="button"
                  aria-label="회원 정보 취소"
                  onClick={handleReset}
                  className="shared-button-gray w-[65px] s:w-1/2"
                >
                  취소
                </button>
                <button type="submit" aria-label="회원 정보 저장" className="shared-button-green w-[65px] s:w-1/2">
                  저장
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>

      {/* 취소 모달 렌더링 */}
      {isCancelModalOpen && renderCancelModal()}

      {/* 탈퇴 모달 (추후 작업 예정) */}
      {/* {isDeleteModalOpen && renderDeleteModal()} */}
    </section>
  );
};

export default ProfileInfo;
