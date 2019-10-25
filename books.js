$bookList = []
const testBook = new Book('The Hobbit', 'J.R.R. Tolkien', 295, true)


function updateDatabase(deleteIndex = false){
    var arrayLength = $bookList.length;
    for (var i = 0; i < arrayLength; i++) {
        firebase.database().ref("books").child(i).set($bookList[i]);
    } 
    if (deleteIndex){
        firebase.database().ref("books").child(deleteIndex).remove();

    }
    
}

const dbRefObject = firebase.database().ref();
dbRefObject.on('child_added', snap => {
    $bookList = snap.val()
    console.log($bookList)
    render()
    /*addBookToLibrary(arr["title"],arr["author"],arr["pageNumber"],arr["haveIRead"])*/
});





function Book(title, author, pageNumber, haveIRead) {
    this.title = title
    this.author = author
    this.pageNumber = pageNumber
    this.haveIRead = haveIRead
}

function addBookToLibrary(title, author, pageNumber, haveIRead = false){

    console.log('adding ' + title + ' to library')
    const book = new Book(title, author, pageNumber, haveIRead);
    $bookList.push(book);

}


/*doesn't confirm - cancel still deletes*/
function getConfirmation(i) {
    var retVal = confirm("Are you sure you want to delete " + $bookList[i].title + " by " + $bookList[i].author + "?");
    if( retVal == true ) {
       return true;
    } else {
       return false;
    }
}

function deleteBook(i){

    console.log("deleting book # " + i + " row")

    if (getConfirmation(i)){
        $bookList.splice(i,1);
        render();
    }
    updateDatabase(i);


}

function readBook(i){

    console.log($bookList)
    $bookList[i]["haveIRead"] = !$bookList[i]["haveIRead"];
    render();

}

function addRow(book, i){

    if (!document.getElementsByTagName) return;
    tabBody=document.getElementsByTagName("tbody").item(0);
    row=document.createElement("tr");
    row.setAttribute("id",i)
    cell1 = document.createElement("td");
    cell2 = document.createElement("td");
    cell3 = document.createElement("td");
    cell4 = document.createElement("td");
    cell5 = document.createElement("td");
    textnode1=document.createTextNode(book.title);
    textnode2=document.createTextNode(book.author);
    textnode3=document.createTextNode(book.pageNumber);
    deleteButton=document.createElement("BUTTON");
    deleteButton.onclick = function(){deleteBook(i)};
    deleteButton.innerHTML = "x";
    readButton=document.createElement("BUTTON");
    readButton.onclick = function(){readBook(i)};
    readButton.innerHTML = book.haveIRead;
    cell1.appendChild(textnode1);
    cell2.appendChild(textnode2);
    cell3.appendChild(textnode3);
    cell4.appendChild(readButton);
    cell5.appendChild(deleteButton);
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    row.appendChild(cell5);
    tabBody.appendChild(row);

}

function resetTable(){
    var mytbl = document.getElementById("bookTable");
    mytbl.getElementsByTagName("tbody")[0].innerHTML = mytbl.rows[0].innerHTML;
}

function render(){

    resetTable()
    var arrayLength = $bookList.length;
    for (var i = 0; i < arrayLength; i++) {
        addRow($bookList[i], i);
    }
    updateDatabase();
}

function validate(title, author, pageNumber = 0, haveIRead){

    if (title.length ==0){
        /*error*/
    }
    else if(author.length ==0){
        /*error*/
    }
    else if(isNaN(pageNumber)){
        /*error*/
    }
    
    else{
        return true
    }
    
}

function newBook(){

    title = document.getElementById("title").value
    author = document.getElementById("author").value
    pageNumber = document.getElementById("pageNumber").value
    haveIRead = document.getElementById("haveIRead").checked

    if (validate(title, author, pageNumber, haveIRead)){
        addBookToLibrary(title, author, pageNumber, haveIRead);
        render();
        toggleForm();
    }
    else{
        console.log('cannot validate')

    }
    
}

function toggleForm(){
    document.getElementById("formContainer").classList.toggle("hide");
}




