import {takeLatest, call, put, all} from 'redux-saga/effects';

import {Alert} from 'react-native';
import api from '~/services/api';
import {signInSucess, signFailure} from './actions';

export function* singIn({payload}) {
  try {
    const {email, password} = payload;

    const res = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const {token, user} = res.data;

    if (user.provider) {
      Alert.alert(
        'Erro no login',
        'O Usuário não pode ser um prestador de serviço',
      );
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSucess(token, user));

    // history.push('/dashboard');
  } catch (error) {
    Alert.alert('Falha na autenticação', 'Usuário ou senha inválido');
    yield put(signFailure());
  }
}

export function* singUp({payload}) {
  try {
    const {name, email, password} = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
    });

    // history.push('/');
  } catch (error) {
    Alert.alert('Falha no cadastro', 'Erro ao registrar');
    yield put(signFailure());
  }
}

export function setToken({payload}) {
  if (!payload) return;

  const {token} = payload.auth;
  api.defaults.headers.Authorization = `Bearer ${token}`;
}

export function singOut() {
  // history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', singIn),
  takeLatest('@auth/SIGN_UP_REQUEST', singUp),
  takeLatest('@auth/SIGN_OUT', singOut),
]);
