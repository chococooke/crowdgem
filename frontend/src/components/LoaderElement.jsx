const LoaderElement = ({ size, type }) => {
    if (!size) {
        size = 40
    }
    return (
        <div
            style={{ height: `${size}px`, width: `${size}px` }}
            className={`loader loader-${type}`}>
        </div>
    )
}

export default LoaderElement;