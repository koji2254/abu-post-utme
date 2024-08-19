/* eslint-disable react/prop-types */
const ErrAlert = ({ text }) => {
   return (
      <div className="bg-red-100 border border-red-400 border-l-4 text-red-700 px-4 py-3 rounded fixed top-10 left-1/2 transform -translate-x-1/2 w-11/12 md:w-8/12 z-50" role="alert">
      <span className="block sm:inline">{text}</span>
    </div>
   );
 }
 
 export default ErrAlert;
 