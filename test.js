To whom is reading


AUTHENTICATION{
    RESENTOKEN : localhost:8080/auth/resend/token method=POST

    SIGNUP :  localhost:8080/auth/signup        method=POST

    LOGIN : localhost:8080/auth/login       method=POST
    
    RESET_PASSWORD : localhost:8080/auth/reset/password      method=POST
    
    CHANGE_PASSWORD : localhost:8080/auth/change/password        method=PATCH

}


CATEGORY {
    FETCHALL : localhost:8080/category/get-categories   method=GET

    FETCH_ONE_CATEGORY     :   localhost:8080/category/get-category/id   method=get

    ADD_CATEGORY :  localhost:8080/category/add-category      method=post

    EDIT_CATEGORY :         localhost:8080/category/edit-category/id   method=PUT

    DELETE_CATEGORY:        localhost:8080/category/delete-category/id    method=DELETE


}

NOTE {
createNOTE :    localhost:8080/note/create-note       method=POST

FETCH_NOTE :    localhost:8080/note/get-note/id       method=GET

EDIT_NOTE :     localhost:8080/note/edit-note/id       method= PUT

DELETE_NOTE :   localhost:8080/note/delete-note/id       method= DELETE

FETCH_ALL   :   localhost:8080/note/get-notes?page=2&category=sport&sort=true&order=-1     method=GET (if you want you can search by tag in body,we can make fetching note public for all)
                        

}

EXTRA {
    POPULATE_HASHTAG :      localhost:8080/extra/popular method=GET


}
we can change by: for example deleting hashtag when the counter is 0,
Or let suppose we can make the fetching notes public and all users can see and search for them
the client can review and tell us what he exactly want.


                                        BEST REGARDS ,
                                        ASSAF.



