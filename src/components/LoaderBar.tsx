import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import default styles

// Configure NProgress (Optional: Remove spinner)
NProgress.configure({ showSpinner: false });

interface LoaderBarProps {
  loading: boolean;
}

const LoaderBar: React.FC<LoaderBarProps> = ({ loading }) => {
    // console.log(loading);
    // alert(loading)
    
  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [loading]);

  return null; // No UI element, just triggers NProgress
};

export default LoaderBar;
