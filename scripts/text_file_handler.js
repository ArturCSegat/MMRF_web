function create_and_download_text_file(content, filename){
    const a = document.createElement('a');
    const file = new Blob([content], {type: "text/plain"});

    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}


export { create_and_download_text_file }
