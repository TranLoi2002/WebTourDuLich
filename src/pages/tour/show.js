import CardTour from '../../components/card_tour';

const Show = () => {
    return (
        <div className="show_tour">
            <p className="title">Top BangKok tours</p>
            <div className="tour_row_1">
                <CardTour/>
                <CardTour/>
                <CardTour/>
            </div>
        </div>
    );
}

export default Show;