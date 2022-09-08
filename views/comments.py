from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, Post, User
from views import can_view_post, get_authorized_user_ids
import flask_jwt_extended

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()

        print(body)

        comment_id_query = (
        db.session
            .query(User.id)
            .all()
        )
        comment_ids = [id for (id,) in comment_id_query]


        follower_ids = get_authorized_user_ids(self.current_user)

        body_post_id = body.get('post_id')

        body_text = body.get('text')

        if body_text == None:
            return Response(json.dumps({"message": "'text' is missing."}), mimetype="application/json", status=400)

        if not str(body_post_id).isdigit():
            return Response(json.dumps({"message": "'post_id' is invalid."}), mimetype="application/json", status=400)

        if not can_view_post(int(body_post_id), self.current_user):
            return Response(json.dumps({"message": "'post_id' is invalid."}), mimetype="application/json", status=404)


        new_comment = Comment(
            user_id = self.current_user.id,
            text = body_text, # must be a valid user_id or will throw an error
            post_id = body_post_id,   
        )
        
        db.session.add(new_comment)    # issues the insert statement
        db.session.commit()         # commits the change to the database 


        return Response(json.dumps(new_comment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        comment = Comment.query.get(id)

        if not comment:
            return Response(json.dumps({"message": "id = {0} is invalid".format(id)}), mimetype="application/json", status=404)

        # delete post where "id"=id

        if not str(comment.user_id).isdigit():
            return Response(json.dumps({"message": "'post_id' is invalid."}), mimetype="application/json", status=400)

        #you should only be able to edit and delete posts that you yourself created
        if int(comment.user_id) != self.current_user.id:
            return Response(json.dumps({"message": "id = {0} is invalid".format(id)}), mimetype="application/json", status=404)

        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "comment id ={0} was successfully deleted".format(id)}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
