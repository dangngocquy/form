const DeleteHTML = (content) => {
    return content.replace(/<\/?[^>]+(>|$)|&nbsp;/g, "");
};

export default DeleteHTML;