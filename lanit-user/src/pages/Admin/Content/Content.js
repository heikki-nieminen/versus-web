export const Content = (props) => {
    const {content} = props

    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: content.value}}/>
        </div>
    )
}