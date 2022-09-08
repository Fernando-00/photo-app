from flask import Response, request
from flask_restful import Resource
from models import Bookmark, db, User
import json
from views import get_authorized_user_ids, can_view_post
import flask_jwt_extended

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        # get all bookmarks owned by the current user
        bookmarks = Bookmark.query.filter_by(user_id=self.current_user.id)
        bookmark = [bookmark_user.to_dict() for bookmark_user in bookmarks]
        # print(bookmark)
        return Response(json.dumps(bookmark), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()


        #querys for current user's bookmarks
        #used later on to check for duplicates
        bookmark_post_ids_query = (
        db.session
            .query(Bookmark.post_id)
            .filter(Bookmark.user_id == self.current_user.id)
            .all()
        )
        #query for all user id's in the database
        #utlized to find out which ID's are invalid
        bookmark_ids_query = (
        db.session
            .query(User.id)
            .all()
        )
        bookmark_ids = [id for (id,) in bookmark_ids_query]

        
        post_ids = [id for (id,) in bookmark_post_ids_query]

        
        body_post_id = body.get('post_id')
        

        # don't forget to add the current user:
       
        if not body_post_id:
            return Response(json.dumps({"message": "'post_id' is required."}), mimetype="application/json", status=400)

        #checking that string format is allowed
        
        if not str(body_post_id).isdigit():
            return Response(json.dumps({"message": "'post_id' is invalid."}), mimetype="application/json", status=400)

        #checking if bookmark is duplicate
        if int(body_post_id) in post_ids:
            return Response(json.dumps({"message": "bookmark already exists"}), mimetype="application/json", status=400)

        #checking if authorized bookmark
        if not can_view_post(int(body_post_id), self.current_user):
            return Response(json.dumps({"message": "'post_id' is invalid."}), mimetype="application/json", status=404)

        #checking if user exists
        if int(body_post_id) not in bookmark_ids:
            return Response(json.dumps({"message": "post_id does not exist"}), mimetype="application/json", status=404)

        #creating new bookmark post
        new_bookmark = Bookmark(
            user_id = self.current_user.id,
            post_id = body_post_id, # must be a valid user_id or will throw an error
            
        )
        db.session.add(new_bookmark)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        # insert whatever was posted into the database (and let's do some validation)
        return Response(json.dumps(new_bookmark.to_dict()), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        bookmark = Bookmark.query.get(id)

        if not bookmark:
            return Response(json.dumps({"message": "id = {0} is invalid".format(id)}), mimetype="application/json", status=404)

        # delete post where "id"=id

        if not str(bookmark.user_id).isdigit():
            return Response(json.dumps({"message": "'post_id' is invalid."}), mimetype="application/json", status=400)

        #you should only be able to edit and delete posts that you yourself created

        if int(bookmark.user_id) != self.current_user.id:
            return Response(json.dumps({"message": "id = {0} is invalid".format(id)}), mimetype="application/json", status=404)

        Bookmark.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "Bookmark id ={0} was successfully deleted".format(id)}), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<int:id>', 
        '/api/bookmarks/<int:id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
