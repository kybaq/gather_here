"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LikeButton from "@/components/EventsDetail/ITLikeButton";

const supabase = createClient();

const EventDetailPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const eventId = pathname.split("/").pop() as string;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        const { data: eventData, error: eventError } = await supabase
          .from("IT_Events")
          .select("*")
          .eq("event_id", eventId)
          .single();

        if (eventError) {
          console.error("Error fetching event:", eventError);
          setLoading(false);
          return;
        }

        setEvent(eventData);

        const { data: currentUserData, error: currentUserError } = await supabase.auth.getUser();
        if (currentUserError) {
          console.error("Error fetching current user:", currentUserError);
        } else {
          setCurrentUser(currentUserData?.user);
        }

        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL이 클립보드에 복사되었습니다!");
      })
      .catch(() => {
        toast.error("URL 복사에 실패했습니다.");
      });
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found.</div>;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s bg-background text-fontWhite rounded-lg shadow-md">
        <button onClick={() => router.push("/")} className="text-labelNeutral mt-2 mb-4 flex items-center space-x-2">
          <Image src="/Common/Icons/back.png" alt="Back" width={16} height={16} />
          <span>목록으로 돌아갈게요</span>
        </button>
      </div>
      <div className="mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s p-4 bg-fillAlternative text-fontWhite rounded-lg shadow-md">
        <ToastContainer />
        <h1 className="text-title font-title mb-4">{event.title}</h1>
        <div className="flex justify-end items-center mb-4 space-x-2">
          <button type="button" onClick={handleShare} className="flex items-center">
            <Image src="/Main/share_button.png" alt="공유하기" width={20} height={20} />
          </button>
          <LikeButton eventId={eventId} currentUser={currentUser} />
        </div>
        <div className="bg-fillStrong p-4 rounded-lg mb-4">
          {event.img_url && (
            <img src={event.img_url} alt={event.title} className="w-full h-64 object-cover mb-4 rounded-lg" />
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong className="text-labelNeutral">주최</strong> <span className="ml-5">{event.host}</span>
              </p>
              <p>
                <strong className="text-labelNeutral">분류</strong> <span className="ml-5">{event.category}</span>
              </p>
              <p>
                <strong className="text-labelNeutral">일시</strong>{" "}
                <span className="ml-5">
                  {formatDate(event.date_start)} - {formatDate(event.date_done)}
                </span>
              </p>
              <p>
                <strong className="text-labelNeutral">장소</strong> <span className="ml-5">{event.location}</span>
              </p>
            </div>
            <div>
              <p>
                <strong className="text-labelNeutral">신청 기간</strong>{" "}
                <span className="ml-5">
                  {formatDate(event.apply_start)} - {formatDate(event.apply_done)}
                </span>
              </p>
              <p>
                <strong className="text-labelNeutral">가격</strong>
              </p>
              <ul className="ml-4">
                <li>일반 구매자 - {event.price?.regular || "N/A"}원</li>
                <li>강의 구매자 - {event.price?.student || "N/A"}원</li>
              </ul>
            </div>
          </div>
        </div>
        <a
          href={event.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-accentMint text-white text-center py-2 rounded-lg mb-4"
        >
          신청하러 가기
        </a>
        <hr className="border-fillNeutral mb-4" />
        <h2 className="text-lg text-labelAssistive font-semibold mb-5">행사 상세</h2>
        <div className="bg-fillNormal p-4 rounded-lg shadow-md">
          <p>{event.description}</p>
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;
