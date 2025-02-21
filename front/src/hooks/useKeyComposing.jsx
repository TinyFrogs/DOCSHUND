import { useState } from "react";

const useKeyComposing = () => {
  const [isComposing, setIsComposing] = useState(false);

  const keyComposingEvents = {
    onCompositionStart: () => setIsComposing(true),
    onCompositionEnd: () => setIsComposing(false),
  };

  return { isComposing, keyComposingEvents };
};

export default useKeyComposing;
