import { useState } from "react";
import PropTypes from "prop-types";

const containerStyle = {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    height: '70px',
    // border: '2px solid blue'
}

const starContainerStyle = {
    height: '30px',
    width: '330px',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    // border: '1px solid pink'
}

const starStyle = {
    width: '30px',
    height: '30px',
    display: 'inline-block',
    cursor: 'pointer',
    // border: '1px solid red',
}


// type checking of props
StarRating.propTypes = {
    maxRating: PropTypes.number,
    // maxRating: PropTypes.number.isRequired
    starColor: PropTypes.string,
    textColor: PropTypes.string,
    size: PropTypes.number,
    className: PropTypes.string,
    messages: PropTypes.array,
    onSetRating: PropTypes.func,
}

export default function StarRating({
    maxRating = 5,
    starColor = '#fcc419',
    textColor = '#ffffff',
    size = 48,
    className = '',
    // messages = ['Terrible', 'Bad', 'Okay', 'Good', 'Amazing'],
    messages = [],
    defaultRating = 0,
    onSetRating
}) {
    const [rating, setRating] = useState(defaultRating);
    const [tempRating, setTempRating] = useState(0)

    function handleRating(rating) {
        setRating(rating)
        onSetRating(rating)
    }
    // const visibilityHidden = {
    //     height: '100px'
    // }
    const textStyle = {
        fontSize: size / 1.5,
        margin: '0',
        color: textColor
    }
    const starDeco = {
        color: starColor,
        width: `${size}px`,
        height: `${size}px`
    }

    return (
        <>
            <div style={containerStyle} className={className}>
                <div style={starContainerStyle} >
                    {Array.from({ length: maxRating }, (_, i) => (
                        <Star
                            key={i}
                            onRate={() => handleRating(i + 1)}
                            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
                            onMouseEnter={() => setTempRating(i + 1)}
                            onMouseLeave={() => setTempRating(0)}
                            starDeco={starDeco}
                        />
                    ))}
                </div>

                {/* <p style={textStyle}>{messages.length === maxRating ? messages[tempRating ? tempRating - 1 : rating - 1] : tempRating || rating || ''}</p> */}
            </div>
            {/* <p style={tempRating >= 1 || rating >= 1 ? textStyle : visibilityHidden}>{messages.length === maxRating ? messages[tempRating ? tempRating - 1 : rating - 1] : tempRating || rating || ''}</p> */}
        </>
    )
}

function Star({ onRate, full, onMouseEnter, onMouseLeave, starDeco }) {
    return (
        <span role="button" style={starStyle} onClick={onRate} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
            {
                full ? <i className="fa-solid fa-star" style={starDeco}></i> :
                    <i className="fa-regular fa-star" style={starDeco}></i>
            }
        </span>
    )
}