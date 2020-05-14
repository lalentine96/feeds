const isPageBottom = () => {
    return (
        (
            window.innerHeight 
            + document.documentElement.scrollTop 
            - document.documentElement.offsetHeight
        ) > -5
    );  
};

const changeTag = (obj, tag, action) => {

    const newTags = new Set([...obj["tags"]]);
    newTags[action](tag);

    return {...obj, tags: newTags};    
};

export {
    isPageBottom,
    changeTag
};