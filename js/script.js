const list = document.getElementById('list');
const inputNume = document.getElementById('inputNume');
const inputNumar = document.getElementById('inputNumar');
const inputEmail = document.getElementById('inputEmail');
const inputComentariu = document.getElementById('inputComentariu');

const addButton = document.getElementById('addButton');
var updateButton = document.getElementById('updateButton');

function getComments() {
    fetch('http://localhost:3000/comments')
        .then(function (response) {
            response.json().then(function (comments) {
                appendCommentsToDOM(comments);
            });
        });
}

function postComment() {
    const postObject = {
        name: inputNume.value,
        number: inputNumar.value,
        email: inputEmail.value,
        comment: inputComentariu.value
    };
    fetch('http://localhost:3000/comments', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        getComments();
        resetForm();
    });
}

function deleteComment(id) {
    fetch(`http://localhost:3000/comments/${id}`, {
        method: 'DELETE',
    }).then(function () {
        getComments();
    });
}

function updateComment(id) {
    const putObject = {
        name: inputNume.value,
        number: inputNumar.value,
        email: inputEmail.value,
        comment: inputComentariu.value
    };
    fetch(`http://localhost:3000/comments/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        getComments();

        addButton.disabled = false;

        clearUpdateButtonEvents();

        resetForm();
    });
}

function editComment(comment) {
    inputNume.value = comment.name;
    inputNumar.value = comment.number;
    inputEmail.value = comment.email;
    inputComentariu.value = comment.comment;

    addButton.disabled = true;

    clearUpdateButtonEvents();

    updateButton.disabled = false;
    updateButton.addEventListener('click', function () {
        updateComment(comment.id)
    });

}

function appendCommentsToDOM(comments) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    for (let i = 0; i < comments.length; i++) {

        let name = document.createElement('p');
        name.innerHTML = comments[i].name;

        let email = document.createElement('p');
        email.innerHTML = comments[i].email;

        let number = document.createElement('p');
        number.innerHTML = comments[i].number;

        let comment = document.createElement('p');
        comment.innerHTML = comments[i].comment;

        let editButton = document.createElement('button')
        editButton.addEventListener('click', function () {
            editComment(comments[i])
        });
        editButton.innerText = 'Edit';
        let deleteButton = document.createElement('button')
        deleteButton.addEventListener('click', function () {
            deleteComment(comments[i].id)
        });
        deleteButton.innerText = 'Delete';

        let container = document.createElement('div');

        container.appendChild(email);
        container.appendChild(number);
        container.appendChild(name);
        container.appendChild(comment);
        container.appendChild(editButton);
        container.appendChild(deleteButton);

        list.appendChild(container);
    }
}

function resetForm() {
    inputNumar.value = '';
    inputNume.value = '';
    inputEmail.value = '';
    inputComentariu.value = '';
}

function clearUpdateButtonEvents() {
    let newUpdateButton = updateButton.cloneNode(true);
    updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
    updateButton = document.getElementById('updateButton');
}

addButton.addEventListener('click', postComment);

getComments();