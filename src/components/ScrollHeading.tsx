export default function ScrollHeading({text,id,className=''}:{text:string;id?:string;className?:string}){
 return <h2 id={id} className={className} aria-label={text} data-scroll-heading="">
  {text.split(' ').map((word,i)=><span key={i} className="home-word-mask" aria-hidden="true"><span>{word}{' '}</span></span>)}
 </h2>
}
