from keras.models import Sequential
from keras.layers import Dense, Activation, normalization
from keras import optimizers
import numpy as np


input_shape = 211
epochs=250
timestamp = 1511398860
data_size=1362
batch_size=32

model = Sequential()
model.add(Dense(units=input_shape, activation='relu', use_bias=True,
                    kernel_initializer='random_uniform', bias_initializer='he_normal', input_dim=input_shape))
model.add(normalization.BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer='zeros', gamma_initializer='ones',
                                               moving_mean_initializer='zeros', moving_variance_initializer='ones', beta_regularizer=None, gamma_regularizer=None, beta_constraint=None, gamma_constraint=None))            

for i in range(9):
    model.add(Dense(units=input_shape, activation='relu', use_bias=True,
                    kernel_initializer='random_uniform', bias_initializer='he_normal'))
    model.add(normalization.BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer='zeros', gamma_initializer='ones',
                                               moving_mean_initializer='zeros', moving_variance_initializer='ones', beta_regularizer=None, gamma_regularizer=None, beta_constraint=None, gamma_constraint=None))


sgd = optimizers.SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='mean_squared_error', optimizer=sgd)

delays = np.loadtxt('D:/Luyu/data/delaycsv/delay_' +
                   str(timestamp) + '.csv', skiprows=1, unpack=True)
labels = np.loadtxt('D:/Luyu/data/labelcsv/label_' +
                    str(timestamp) + '.csv', skiprows=1, unpack=True)


i=0
while i<data_size-1:
    timestamp += 60
    try:
        delay = np.loadtxt('D:/Luyu/data/delaycsv/delay_' +
                        str(timestamp) + '.csv', skiprows=1, unpack=True)
        delays=np.vstack((delays, delay))
        label = np.loadtxt('D:/Luyu/data/labelcsv/label_' +
                        str(timestamp) + '.csv', skiprows=1, unpack=True)
        labels=np.vstack((labels, label))
        i=i+1
        if i%100==0:
            print(i)
    except:
        pass
print(delays.shape,labels.shape,i)
model.fit(delays, labels, epochs=epochs, batch_size=batch_size,verbose=0)
path_model="D:\\Luyu\\data\\model.h5"
model.save(path_model)