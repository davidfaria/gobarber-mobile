import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '~/components/Background';

import {Container, HourList, Hour, Title} from './styles';
import DateInput from '~/components/DateInput';
import api from '~/services/api';

export default function SelectDate({navigation}) {
  const [date, setDate] = useState(new Date());
  const provider = navigation.getParam('provider');
  const [hours, setHours] = useState([]);

  useEffect(() => {
    async function loadAvailable() {
      const res = await api.get(`providers/${provider.id}/available`, {
        params: {
          date: date.getTime(),
        },
      });

      setHours(res.data);
    }

    loadAvailable();
  }, [date, provider.id]);

  function handleSelectedHour(time) {
    navigation.navigate('Confirm', {
      provider,
      time,
    });
  }

  return (
    <Background>
      <Container>
        <DateInput date={date} onChange={setDate} />

        <HourList
          data={hours}
          keyExtractor={item => item.time}
          renderItem={({item}) => (
            <Hour
              onPress={() => handleSelectedHour(item.value)}
              enabled={item.avaliable}>
              <Title>{item.time}</Title>
            </Hour>
          )}
        />
      </Container>
    </Background>
  );
}

SelectDate.navigationOptions = ({navigation}) => ({
  title: 'Selecione o horário',
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});
