// import { useEffect } from 'react';

// const useMathJax = (content) => {
//   useEffect(() => {
//     const typeset = () => {
//       if (window.MathJax) {
//         if (window.MathJax.typesetPromise) {
//           window.MathJax.typesetPromise([content])
//             .catch((err) => console.error(err));
//         } else {
//           window.MathJax.typeset();
//         }
//       }
//     };

//     // Wait for MathJax to be loaded
//     const script = document.querySelector('#MathJax-script');
//     if (script && script.readyState) {
//       script.onreadystatechange = function () {
//         if (this.readyState === 'complete') typeset();
//       };
//     } else {
//       script.onload = typeset;
//     }
//   }, [content]);
// };

// export default useMathJax;
