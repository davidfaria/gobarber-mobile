import {takeLatest, call, put, all} from 'redux-saga/effects';
import {Alert} from 'react-native';
import api from '~/services/api';
import {updateProfileSucess, updateProfileFailure} from './actions';

function* updateProfile({payload}) {
  try {
    const {name, email, ...rest} = payload.data;

    const profile = {
      name,
      email,

      ...(rest.oldPassword ? rest : {}),
    };

    const res = yield call(api.put, 'users', profile);

    Alert.alert('Sucesso', 'Perfil Atualizado com sucesso!');

    yield put(updateProfileSucess(res.data));
  } catch (error) {
    Alert.alert('Error', 'Erro ao atualizar perfil, confira seus dados!');
    yield put(updateProfileFailure());
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
