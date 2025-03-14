import Advert from "../components/advert";
import BookEasy from "../components/book_easy";
import Discover from "../components/discover";
import Services from "../components/services";
import Gallery from "../components/gallery";
const Home = () => {
    const images = [
        {src: 'https://www.w3schools.com/w3images/mountains.jpg', alt: 'mountains', location: 'Mountains'},
        {src: 'https://www.w3schools.com/w3images/forestbridge.jpg', alt: 'forest bridge', location: 'Forest Bridge'},
        {src: 'https://www.w3schools.com/w3images/nature.jpg', alt: 'nature', location: 'Nature'},
        {src: 'https://www.w3schools.com/w3images/mist.jpg', alt: 'mist', location: 'Mist'},
        {src: 'https://www.w3schools.com/w3images/paris.jpg', alt: 'paris', location: 'Paris'},
        {src: 'https://www.w3schools.com/w3images/newyork.jpg', alt: 'new york', location: 'New York'},
        {src: 'https://www.w3schools.com/w3images/sanfran.jpg', alt: 'san francisco', location: 'San Francisco'},
        {src: 'https://www.w3schools.com/w3images/pisa.jpg', alt: 'pisa', location: 'Pisa'},
        {src: 'https://www.w3schools.com/w3images/paris.jpg', alt: 'paris', location: 'Paris'},
        {src: 'https://www.w3schools.com/w3images/newyork.jpg', alt: 'new york', location: 'New York'},
        {src: 'https://www.w3schools.com/w3images/sanfran.jpg', alt: 'san francisco', location: 'San Francisco'},
        {src: 'https://www.w3schools.com/w3images/pisa.jpg', alt: 'pisa', location: 'Pisa'},
        ];
    return (
        <>
            <Advert/>
            <BookEasy/>
            <Services/>
            <Discover/>
            <Gallery images={images} />
        </>
    );
}
export default Home;