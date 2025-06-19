import "./index.css";
import BannerCategory from "./components/BannerCategory.tsx";
import HomeBanner from "./components/HomeBanner.tsx";
import Highligths from "./components/Highligths.tsx";
import Container from "./components/Container.tsx";
import TopCategories from "./components/TopCategories.tsx";
import ProductList from "./components/ProductList.tsx";
import DiscountedBanner from "./components/DiscountedBanner.tsx";
import BlogPost from "./components/BlogPost.tsx";

function App() {
  return (
    <Container className="py-0 px-1 md:px-1.5 lg:px-2">
      <BannerCategory />
      <HomeBanner />
      <Highligths />
      <TopCategories />
      <ProductList />
      <DiscountedBanner />
      <BlogPost />
    </Container>
  );
}

export default App;
