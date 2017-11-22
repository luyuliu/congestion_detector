from keras.models import Sequential
from keras.layers import Dense, Activation, normalization
from keras import optimizers
import numpy as np
timestamp=1511118600

#delay= genfromtxt('D:/Luyu/data/delaycsv/delay_' + str(timestamp) + '.csv', delimiter=',',dtype=None)
#label= genfromtxt('D:/Luyu/data/labelcsv/label_' + str(timestamp) + '.csv', delimiter=',',dtype=None)
delay= np.loadtxt('D:/Luyu/data/delaycsv/delay_' + str(timestamp) + '.csv',skiprows=1,unpack=True)
label= np.loadtxt('D:/Luyu/data/labelcsv/label_' + str(timestamp) + '.csv',skiprows=1,unpack=True)

model = Sequential()
input_shape = 211;
batch_size = 32;
for i in range(10):
    model.add(Dense(batch_size=batch_size,units=input_shape, activation='relu', use_bias=True, kernel_initializer='random_uniform', bias_initializer='he_normal', input_dim=input_shape))
    model.add(normalization.BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer='zeros', gamma_initializer='ones',
                                               moving_mean_initializer='zeros', moving_variance_initializer='ones', beta_regularizer=None, gamma_regularizer=None, beta_constraint=None, gamma_constraint=None))


sgd = optimizers.SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='mean_squared_error', optimizer=sgd)

model.fit(delay, label, epochs=10, batch_size=32)