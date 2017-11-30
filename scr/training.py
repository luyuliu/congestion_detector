from keras.models import Sequential
from keras.layers import Dense, Activation, normalization,core
from keras import optimizers,callbacks
import numpy as np
import csv


input_shape = 211
epochs = 500
timestamp = 1511398860
data_size = 9850
batch_size = 100

class LossHistory(callbacks.Callback):
    def on_train_begin(self, logs={}):
        self.losses = []

    def on_batch_end(self, batch, logs={}):
        self.losses.append(logs.get('loss'))

history = LossHistory()
model = Sequential()
model.add(Dense(units=input_shape, activation='relu', use_bias=True,
                kernel_initializer='random_uniform', bias_initializer='he_normal', input_dim=input_shape))
model.add(normalization.BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer='zeros', gamma_initializer='ones',
                                           moving_mean_initializer='zeros', moving_variance_initializer='ones', beta_regularizer=None, gamma_regularizer=None, beta_constraint=None, gamma_constraint=None))
model.add(core.Dropout(0.25, noise_shape=None, seed=None))
for i in range(9):
    model.add(Dense(units=input_shape, activation='relu', use_bias=True,
                    kernel_initializer='random_uniform', bias_initializer='he_normal'))
    model.add(normalization.BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer='zeros', gamma_initializer='ones',
                                               moving_mean_initializer='zeros', moving_variance_initializer='ones', beta_regularizer=None, gamma_regularizer=None, beta_constraint=None, gamma_constraint=None))
    model.add(core.Dropout(0.25, noise_shape=None, seed=None))

sgd = optimizers.SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='mean_squared_error', optimizer=sgd)

delays = np.loadtxt('D:/Luyu/data/delaycsv/delay_' +
                    str(timestamp) + '.csv', skiprows=1, unpack=True)
labels = np.loadtxt('D:/Luyu/data/labelcsv/label_' +
                    str(timestamp) + '.csv', skiprows=1, unpack=True)


i = 0
while i < data_size - 1:
    timestamp += 60
    try:
        delay = np.loadtxt('D:/Luyu/data/delaycsv/delay_' +
                           str(timestamp) + '.csv', skiprows=1, unpack=True)
        label = np.loadtxt('D:/Luyu/data/labelcsv/label_' +
                       str(timestamp) + '.csv', skiprows=1, unpack=True)
    except:
        continue

    delays = np.vstack((delays, delay))
    labels = np.vstack((labels, label))

    i = i + 1
    if i % 100 == 0:
        print(i)
print(delays.shape, labels.shape, i)
model.fit(delays, labels, epochs=epochs, verbose=1,callbacks=[history])



path_model = "D:\\Luyu\\data\\model.h5"
path_history="D:\\Luyu\\data\\history.csv"
model.save(path_model)

np.savetxt(path_history,history.losses,delimiter=',')
