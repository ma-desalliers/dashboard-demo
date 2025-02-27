const typeWriter = (
  message: string,
  callback: (text: string) => void,
  onComplete?: () => void
): () => void => {
  let currentText = '';
  let currentIndex = 0;
  let timerId: number | null = null;
  
  const addNextCharacter = () => {
    if (currentIndex < message.length) {
      // Add the next character to the current text
      currentText += message[currentIndex];
      
      // Call the callback with the updated text
      callback(currentText);
      
      // Move to the next character
      currentIndex++;
      
      // Schedule the next character addition
      timerId = window.setTimeout(addNextCharacter, 20);
    } else {
      // Typing is complete
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  // Start the typing process
  addNextCharacter();
  
  // Return a function to stop typing if needed
  return () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
};

export default typeWriter