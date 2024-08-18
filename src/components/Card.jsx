/* eslint-disable react/prop-types */

const Card = ({ head, body}) => {
  return (
   <div className="border p-2 h-24 w-full space-grotesk">
      <h2 className='font-bold text-xl'>{head}</h2>
      <p className='text-xs'>{body}</p>
   </div>
  )
}

export default Card