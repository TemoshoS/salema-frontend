import {RouteProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Text, TouchableOpacity, View} from 'react-native';
import {CommentType, EventsType, RootStackParamList} from '../../types';
import Header from '../../components/Header';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import styles from './styles';
import UpdateStatus from '../UpdateRequestPopup';
import {RoleStrings} from '../../constants/constants';
import {
  getEvents,
  resetPage,
  setSelectedEventId,
  updateEventStatus,
} from '../../redux/eventSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {getEventStatus} from './helper';
import CommentsPopup from '../../components/CommentsPopup';
import AddEventPopup from '../../components/AddEventPopup';

type NavigationRouteProps = RouteProp<RootStackParamList, 'RequestDetails'>;

interface NavigationProps {
  route: NavigationRouteProps;
}
const defaultEvent = {
  _id: '',
  eventTitle: '',
  eventBody: '',
  comments: [],
  status: '',
};
const RequestDetails: React.FC<NavigationProps> = ({route}) => {
  const data = route.params;

  const {
    _id,
    client,
    securityCompany,
    requestedServices,
    requestedDateTime,
    assignedOfficers,
    requestStatus,
    priority,
  } = data;

  const {companyName} = securityCompany.profile;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventsType>(defaultEvent);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [eventPopupVisible, setEventPopupVisible] = useState(false);
  const role = useAppSelector(state => state.auth.userDetails?.role);
  const {events, success, createEventSuccess} = useAppSelector(
    state => state.events,
  );
  const isEventsVisible = role === RoleStrings.SO || role === RoleStrings.GU;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isEventsVisible) {
      dispatch(getEvents(_id));
    }
  }, [success]);

  useEffect(() => {
    return () => {
      dispatch(resetPage());
    };
  }, []);
  const onUpdateEventPressed = (item: EventsType) => {
    Alert.alert(
      'Update Status?',
      `Are you sure you want to update this event to ${getEventStatus(
        item.status,
      )}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Update',
          onPress: () => {
            dispatch(
              updateEventStatus({
                eventId: item._id,
                status: getEventStatus(item.status),
              }),
            );
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderItem = ({item}: {item: EventsType}) => (
    <View style={styles.cardView}>
      <View style={styles.eventStyle}>
        <Text style={styles.requestText}>{item.eventTitle}</Text>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <Text style={styles.bodyText}>{item.eventBody}</Text>
      <View style={styles.divider} />
      <View style={styles.eventStyle}>
        <TouchableOpacity
          onPress={() => {
            setCommentsVisible(true);
            setSelectedEvent(item);
            dispatch(setSelectedEventId(item));
          }}
          style={styles.commentRow}>
          <Icon name="comment-outline" size={25} color="black" />
          <Text style={styles.commentText}>Comments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onUpdateEventPressed(item)}
          style={styles.commentRow}>
          <Icon name="update" size={25} color="black" />
          <Text style={styles.commentText}>Update Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      <Header title="Company Details" />
      <View style={{marginTop: 10}}>
        <View style={styles.row}>
          <Text style={styles.headerText}>Security Company : </Text>
          <Text style={styles.text}>{companyName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Requested Status : </Text>
          <Text style={styles.text}>{requestStatus}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Requested Services </Text>
          <Text style={styles.text}>{requestedServices.join(', ')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Client : </Text>
          <Text style={styles.text}>{client}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Assigned Officers : </Text>
          <Text numberOfLines={2} style={styles.text}>
            {assignedOfficers.map(item => item.profile.firstName).join(', ')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Requested Date and Time </Text>
          <Text style={styles.text}>{requestedDateTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Priority : </Text>
          <Text style={styles.text}>{priority}</Text>
        </View>
        {role === RoleStrings.MG || RoleStrings.SO ? (
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.updateButton}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsText}>Events</Text>
          <TouchableOpacity onPress={() => setEventPopupVisible(true)}>
            <MaterialIcons name="add-circle-outline" size={25} color="black" />
          </TouchableOpacity>
        </View>

        {events?.length > 0 ? (
          <FlatList
            data={events}
            renderItem={renderItem}
            style={{height: '100%', marginBottom: 20}}
            keyExtractor={item => item._id} // Adds spacing between rows
          />
        ) : (
          <View
            style={{
              marginTop: 60,
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => setEventPopupVisible(true)}>
              <Text style={styles.eventsText}>No Events Yet..Create One?</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {modalVisible ? (
        <UpdateStatus
          serviceReqID={_id}
          modalVisible={modalVisible}
          onSuccess={() => {
            setModalVisible(false);
            navigation.goBack();
          }}
          onClosePressed={() => setModalVisible(false)}
        />
      ) : null}
      {commentsVisible ? (
        <CommentsPopup
          isVisible={commentsVisible}
          eventId={selectedEvent._id}
          onClosePressed={() => {
            setCommentsVisible(false);
            setSelectedEvent(defaultEvent);
          }}
        />
      ) : null}

      <AddEventPopup
        requestID={_id}
        modalVisible={eventPopupVisible}
        onClosePressed={() => {
          setEventPopupVisible(false);
        }}
        onSuccess={() => {
          if (isEventsVisible) {
            dispatch(getEvents(_id));
          }
        }}
      />
    </View>
  );
};
export default RequestDetails;
