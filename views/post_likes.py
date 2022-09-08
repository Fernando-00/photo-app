from flask import Response, request
from flask_restful import Resource
from models import LikePost, db
import json
from views import can_view_post, get_authorized_user_ids
import flask_jwt_extended

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        body = request.get_json()
        print(body)

        like_post_ids_query = (
        db.session
            .query(LikePost.post_id)
            .filter(LikePost.user_id == self.current_user.id)
            .all()
        )

        post_ids = [id for (id,) in like_post_ids_query]

        body_post_id = body.get('post_id')

        if body_post_id in post_ids:
            return Response(json.dumps({"message": "like already exists"}), mimetype="application/json", status=400)

        if not str(body_post_id).isdigit():
            return Response(json.dumps({"message": "'post_id' is invalid."}), mimetype="application/json", status=400)

        if not can_view_post(int(body_post_id), self.current_user):
            return Response(json.dumps({"message": "'post_id' is invalid."}), mimetype="application/json", status=404)

        new_like = LikePost(
            user_id = self.current_user.id,
            post_id = body_post_id
        )
        
        db.session.add(new_like)    # issues the insert statement
        db.session.commit()         # commits the change to the database 





        return Response(json.dumps(new_like.to_dict()), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        like_post = LikePost.query.get(id)

        if not like_post:
            return Response(json.dumps({"message": "id = {0} is invalid".format(id)}), mimetype="application/json", status=404)

        # delete post where "id"=id

        if not str(like_post.user_id).isdigit():
            return Response(json.dumps({"message": "'post_id' is invalid."}), mimetype="application/json", status=400)

        #you should only be able to edit and delete posts that you yourself created

        if int(like_post.user_id) != self.current_user.id:
            return Response(json.dumps({"message": "id = {0} is invalid".format(id)}), mimetype="application/json", status=404)

        LikePost.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "Bookmark id ={0} was successfully deleted".format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/likes', 
        '/api/posts/likes/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
