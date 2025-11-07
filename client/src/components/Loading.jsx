import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="h-14 w-14 rounded-full border-2 border-t-primary animate-spin"></div>
    </div>
  );
};

export default Loading;
