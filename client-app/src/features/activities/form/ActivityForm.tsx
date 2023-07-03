import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Activity } from '../../../app/models/activity';
import LoadingComponent from '../../../app/layouts/LoadingComponent';
import {v4 as uuid} from 'uuid'

const ActivityForm = () => {

    const {activityStore} = useStore();
    const {selectedActivity, createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();

    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: "",
        title:"",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: ""
    });

    useEffect(() => {
      if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity])
    
    const handleSubmit = () => {
        
        if (!activity.id){
            activity.id = uuid();
            createActivity(activity).then(()=> navigate(`/activities/${activity.id}`))
        }
        else {
            updateActivity(activity).then(()=> navigate(`/activities/${activity.id}`))
        }
        activity.id ? updateActivity(activity) : createActivity(activity)
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const {name, value} = event.target;
        setActivity({...activity, [name]: value})
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return ( 
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Input placeholder="Title" value={activity.title} name="title" onChange={handleInputChange} />
                <Form.TextArea placeholder="Description" value={activity.description} name="description" onChange={handleInputChange}  />
                <Form.Input placeholder="Category" value={activity.category} name="category" onChange={handleInputChange} />
                <Form.Input placeholder="Date" type="date" value={activity.date} name="date" onChange={handleInputChange} />
                <Form.Input placeholder="City" value={activity.city} name="city" onChange={handleInputChange} />
                <Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputChange} />
                <Button loading={loading} floated='right' positive type="submit" content="Submit" />
                <Button as={Link} to='/activities' floated='right' type="button" content="Cancel" />
            </Form>
        </Segment>
     );
}
 
export default observer(ActivityForm);