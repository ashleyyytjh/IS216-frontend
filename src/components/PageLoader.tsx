import SpinItem from "./spinner"

const PageLoader = ({text}) => {
    return(
      <div className="flex justify-center flex-col items-center w-full h-64"> <SpinItem/> {text}</div>
    )
}

export default PageLoader