import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate("/" + nextUrl);
      }, 8000);
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="h-14 w-14 rounded-full border-2 border-t-primary animate-spin"></div>
    </div>
  );
};

export default Loading;
