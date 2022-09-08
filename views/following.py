from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json
from tests import utils
from views import get_authorized_user_ids
import flask_jwt_extended

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        following = Following.query.filter_by(user_id=self.current_user.id)
        follower_user = [follower.to_dict_following() for follower in following]
        return Response(json.dumps(follower_user), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
      
        user_ids_query = (
        db.session
            .query(User.id)
            .all()
        )
        user_ids = [id for (id,) in user_ids_query]

        # don't forget to add the current user:
       

        # following = Following.query.filter_by(user_id=self.current_user.id)
        # follower_user = [follower.to_dict_following() for follower in following]

        body_user_id = body.get('user_id')

        if not body_user_id:
            return Response(json.dumps({"message": "'user_id' is required."}), mimetype="application/json", status=400)


        if type(body_user_id) != int:
            return Response(json.dumps({"message": "'user_id' is invalid."}), mimetype="application/json", status=400)

        # duplicate = Following.query.filter_by(user_id = self.current_user.id, following_id = body.get('user_id'))
        
        if body_user_id in get_authorized_user_ids(self.current_user):
            return Response(json.dumps({"message": "user already following"}), mimetype="application/json", status=400)

        if body_user_id not in user_ids:
            return Response(json.dumps({"message": "user already following"}), mimetype="application/json", status=404)

        


        new_following = Following(
            user_id = self.current_user.id,
            following_id = body_user_id, # must be a valid user_id or will throw an error
            
        )
        db.session.add(new_following)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        # insert whatever was posted into the database (and let's do some validation)
        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
        
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "following" record where "id"=id
        print(id)
        #we need to query the database for the post where id = id
        following = Following.query.get(id)

        if not following:
            return Response(json.dumps({"message": "id = {0} is invalid".format(id)}), mimetype="application/json", status=404)

        # delete post where "id"=id

        #you should only be able to edit and delete posts that you yourself created
        if following.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id = {0} is invalid".format(id)}), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "Following id ={0} was successfully deleted".format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
