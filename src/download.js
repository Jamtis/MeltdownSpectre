export default function download(file_name, content) {
    const anchor = document.createElement("a");
    anchor.download = file_name;
    anchor.href = "data:text/plain;charset=utf-8;base64," + btoa(content);
    anchor.click();
};