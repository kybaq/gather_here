"use client";

import React, { ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import useDraft from "@/hooks/useDraft";
import FormInput from "@/components/MainDetail/FormInput";
import FormDropdown from "@/components/MainDetail/FormDropdown";
import FormMultiSelect from "@/components/MainDetail/FormMultiSelect";
import ReactQuillEditor from "@/components/MainDetail/ReactQuillEditor";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonModal from "@/components/Common/Modal/CommonModal";
import LoginForm from "@/components/Login/LoginForm";

interface Option {
  value: string;
  label: string;
}

const supabase = createClient();

const PostPage = () => {
  const [draft, updateDraft, saveDraft] = useDraft();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        toast.error("로그인이 필요합니다!");
      }
    };
    getUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    const payload = {
      user_id: userId,
      title: draft.title,
      category: draft.category,
      location: draft.location,
      duration: Number(draft.duration),
      total_members: Number(draft.totalMembers),
      personal_link: draft.personalLink,
      target_position: draft.targetPosition.map((pos) => pos.value),
      recruitments: Number(draft.recruitments),
      tech_stack: draft.techStack.map((ts) => ts.value),
      deadline: draft.deadline || "",
      content: draft.content,
      place: draft.place,
    };

    const { data, error } = await supabase.from("Posts").insert([payload]).select("post_id");

    if (error) {
      console.error("데이터 안들어간다:", error);
      toast.error("다시 시도해주세요!");
    } else {
      if (data && data[0] && data[0].post_id) {
        localStorage.removeItem("draftPost");
        router.push(`/maindetail/${data[0].post_id}`);
      }
    }
  };

  const handleInputChange = (key: keyof typeof draft) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateDraft(key, e.target.value);
  };

  const handleMultiSelectChange = (key: keyof typeof draft) => (selectedOptions: Option[]) => {
    updateDraft(key, selectedOptions);
  };

  const categoryOptions: Option[] = [
    { value: "스터디", label: "스터디" },
    { value: "프로젝트", label: "프로젝트" },
  ];

  const locationOptions: Option[] = [
    { value: "서울", label: "서울" },
    { value: "인천", label: "인천" },
    { value: "대전", label: "대전" },
    { value: "광주", label: "광주" },
    { value: "대구", label: "대구" },
    { value: "부산", label: "부산" },
    { value: "울산", label: "울산" },
    { value: "세종", label: "세종" },
    { value: "경기", label: "경기" },
    { value: "강원", label: "강원" },
    { value: "충북", label: "충북" },
    { value: "충남", label: "충남" },
    { value: "전북", label: "전북" },
    { value: "전남", label: "전남" },
    { value: "경북", label: "경북" },
    { value: "경남", label: "경남" },
    { value: "제주", label: "제주" },
  ];

  const durationOptions: Option[] = [
    { value: "1", label: "1개월" },
    { value: "2", label: "2개월" },
    { value: "3", label: "3개월" },
    { value: "4", label: "4개월" },
    { value: "5", label: "5개월" },
    { value: "6", label: "6개월" },
    { value: "7", label: "6개월 이상" },
  ];

  const totalMembersOptions: Option[] = [
    { value: "3", label: "3명 이하" },
    { value: "4", label: "4명" },
    { value: "5", label: "5명" },
    { value: "6", label: "6명" },
    { value: "7", label: "7명" },
    { value: "8", label: "8명 이상" },
  ];

  const targetPositionOptions: Option[] = [
    { value: "프론트엔드", label: "프론트엔드" },
    { value: "백엔드", label: "백엔드" },
    { value: "디자이너", label: "디자이너" },
    { value: "IOS", label: "IOS" },
    { value: "안드로이드", label: "안드로이드" },
    { value: "데브옵스", label: "데브옵스" },
    { value: "PM", label: "PM" },
    { value: "기획자", label: "기획자" },
    { value: "마케터", label: "마케터" },
  ];

  const recruitmentsOptions: Option[] = [
    { value: "1", label: "1명" },
    { value: "2", label: "2명" },
    { value: "3", label: "3명" },
    { value: "4", label: "4명" },
    { value: "5", label: "5명" },
    { value: "6", label: "5명 이상" },
  ];

  const techStackOptions: Option[] = [
    { value: "AWS", label: "AWS" },
    { value: "Docker", label: "Docker" },
    { value: "Django", label: "Django" },
    { value: "Express", label: "Express" },
    { value: "Figma", label: "Figma" },
    { value: "Firebase", label: "Firebase" },
    { value: "Flutter", label: "Flutter" },
    { value: "Git", label: "Git" },
    { value: "Go", label: "Go" },
    { value: "GraphQL", label: "GraphQL" },
    { value: "Java", label: "Java" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Jest", label: "Jest" },
    { value: "Kotlin", label: "Kotlin" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "MySQL", label: "MySQL" },
    { value: "Nestjs", label: "Nestjs" },
    { value: "Nextjs", label: "Nextjs" },
    { value: "Nodejs", label: "Nodejs" },
    { value: "Php", label: "Php" },
    { value: "Python", label: "Python" },
    { value: "React", label: "React" },
    { value: "ReactNative", label: "ReactNative" },
    { value: "Spring", label: "Spring" },
    { value: "Svelte", label: "Svelte" },
    { value: "Swift", label: "Swift" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Unity", label: "Unity" },
    { value: "Vue", label: "Vue" },
    { value: "Zeplin", label: "Zeplin" },
  ];

  const placeOptions: Option[] = [
    { value: "온라인", label: "온라인" },
    { value: "오프라인", label: "오프라인" },
    { value: "온/오프라인", label: "온/오프라인" },
  ];

  return (
    <>
      <CommonModal isOpen={showLoginModal} onRequestClose={() => setShowLoginModal(false)}>
        <LoginForm />
      </CommonModal>
      <ToastContainer />
      <div className="w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s bg-background text-fontWhite rounded-lg shadow-md"></div>
      <form
        onSubmit={handleSubmit}
        className="bg-fillStrong w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s p-4 bg-fillAlternative text-fontWhite rounded-lg shadow-md"
      >
        <div className="bg-fillStrong p-6 rounded-lg shadow-md space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg text-labelNormal font-semibold mb-2">
              제목 <span className="text-red-500">*</span>
            </h2>
            <FormInput
              label=""
              value={draft.title}
              onChange={handleInputChange("title")}
              maxLength={50}
              placeholder="제목을 입력해주세요"
            />
            <p className="text-sm text-labelNeutral">제목은 50자 내로 작성해주세요. ({draft.title.length}/50)</p>
          </div>
          <hr className="border-fillNeutral mb-4" />
          <h2 className="text-lg text-labelNeutral font-semibold mb-2">기본 정보</h2>
          <div className="grid grid-cols-2 s:grid-cols-1 gap-4">
            <FormDropdown
              label="분류"
              options={categoryOptions}
              value={draft.category}
              onChange={handleInputChange("category")}
              placeholder="분류를 선택해주세요"
            />
            <FormDropdown
              label="방식"
              options={placeOptions}
              value={draft.place}
              onChange={handleInputChange("place")}
              placeholder="진행 방식을 선택해주세요"
            />
            <FormDropdown
              label="지역"
              options={locationOptions}
              value={draft.location}
              onChange={handleInputChange("location")}
              placeholder="지역을 선택해주세요"
            />
            <FormDropdown
              label="기간"
              options={durationOptions}
              value={draft.duration}
              onChange={handleInputChange("duration")}
              placeholder="기간을 선택해주세요"
            />
            <FormDropdown
              label="총 인원"
              options={totalMembersOptions}
              value={draft.totalMembers}
              onChange={handleInputChange("totalMembers")}
              placeholder="총 참여 인원을 선택해주세요"
            />
            <FormInput
              label={
                <>
                  <span>연락 방법</span>
                  <span className="text-red-500 ml-1">*</span>
                </>
              }
              value={draft.personalLink}
              onChange={handleInputChange("personalLink")}
              placeholder="연락 받을 번호 혹은 이메일을 입력해주세요"
            />
          </div>
        </div>
        <hr className="border-fillNeutral mb-4" />
        <div className="bg-fillStrong p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg text-labelNeutral font-semibold mb-2">모집 정보</h2>
          <div className="grid grid-cols-2 s:grid-cols-1 gap-4">
            <div className="space-y-2">
              <FormMultiSelect
                label="모집 대상"
                options={targetPositionOptions}
                value={draft.targetPosition}
                onChange={handleMultiSelectChange("targetPosition")}
              />
              <p className="text-sm text-labelNeutral">다중 선택이 가능해요.</p>
            </div>
            <div className="space-y-2">
              <FormDropdown
                label="모집 인원"
                options={recruitmentsOptions}
                value={draft.recruitments}
                onChange={handleInputChange("recruitments")}
                placeholder="모집 인원을 선택해주세요"
              />
            </div>
            <div className="space-y-2">
              <FormMultiSelect
                label="기술 스택"
                options={techStackOptions}
                value={draft.techStack}
                onChange={handleMultiSelectChange("techStack")}
              />
              <p className="text-sm text-labelNeutral">다중 선택이 가능해요.</p>
            </div>
            <div className="space-y-2">
              <FormInput
                label={
                  <>
                    <span>마감일</span>
                    <span className="text-red-500 ml-1">*</span>
                  </>
                }
                type="date"
                value={draft.deadline || ""}
                onChange={handleInputChange("deadline")}
                placeholder="마감일을 선택해주세요"
              />
            </div>
          </div>
        </div>
        <hr className="border-fillNeutral mb-4" />
        <div className="bg-fillStrong p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg text-labelNeutral font-semibold mb-2">상세 설명</h2>
          <ReactQuillEditor
            value={draft.content}
            onChange={(value: string) =>
              handleInputChange("content")({ target: { value } } as ChangeEvent<HTMLInputElement>)
            }
            className="bg-fillAssistive text-labelNeutral"
          />
        </div>
        <div className="flex justify-between items-center mt-4 px-4">
          <button onClick={() => router.push("/")} className="text-labelNeutral flex items-center space-x-2 ml-1">
            <Image src="/Common/Icons/back.png" alt="Back" width={16} height={16} />
            <span>나가기</span>
          </button>
          <div className="flex space-x-4 mr-2">
            <button type="button" className="shared-button-gray" onClick={saveDraft}>
              임시 저장
            </button>
            <button type="submit" className="shared-button-green">
              등록
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PostPage;
