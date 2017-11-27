from keras.models import load_model
from keras.layers import Dense, Activation, normalization
from keras import optimizers
import numpy as np
import csv

path_model="D:\\Luyu\\data\\model.h5"
model=load_model(path_model)

input_shape = 211
epochs=250
timestamp = 1511560920
data_size=33

delays = np.loadtxt('D:/Luyu/data/delaycsv/delay_' +
                   str(timestamp) + '.csv', skiprows=1, unpack=True)
labels = np.loadtxt('D:/Luyu/data/labelcsv/label_' +
                    str(timestamp) + '.csv', skiprows=1, unpack=True)


i=0
while i<data_size:
    timestamp += 60
    try:
        delay = np.loadtxt('D:/Luyu/data/delaycsv/delay_' +
                        str(timestamp) + '.csv', skiprows=1, unpack=True)
        delays=np.vstack((delays, delay))
        label = np.loadtxt('D:/Luyu/data/labelcsv/label_' +
                        str(timestamp) + '.csv', skiprows=1, unpack=True)
        labels=np.vstack((labels, label))
        i=i+1
    except:
        print("skip.")
print(delays.shape,labels.shape,i)

'''
predicts=model.predict(x=delays, verbose=1)

csvFile1 = open("D:\\Luyu\\data\\predict.csv","w",newline='')
writer1 = csv.writer(csvFile1)

csvFile2 = open("D:\\Luyu\\data\\label.csv","w",newline='')
writer2 = csv.writer(csvFile2)

writer1.writerows(predicts)
writer2.writerows(labels)

'''
score=model.evaluate(x=delays, y=labels,verbose=1)
print(score)