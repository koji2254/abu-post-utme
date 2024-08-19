

// eslint-disable-next-line react/prop-types
const GreenBtn = ({ onClick, text}) => {
  return (
      <button 
        className="border-none bg-pr-green text-gray-100 p-2 rounded hover:bg-green-700 font-semibold space-grotesk"
        onClick={onClick}
      >
      {text}
      </button>
  )
}

export default GreenBtn