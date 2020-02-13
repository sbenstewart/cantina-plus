import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn import metrics

from scikit_roughsets.rs_reduction import RoughSetsSelector

import joblib

def extractDigits(lst): 
    res = [] 
    for el in lst: 
        sub = el.split(' ') 
        res.append(sub) 
      
    return(res) 

labels = []
data_file = open('dataset/Training Dataset.arff').read()
data_list = data_file.split('\r\n')
data = np.array(data_list)
data1 = [i.split(',') for i in data]
data1 = data1[0:-1]
for i in data1:
    labels.append(i[30])
data1 = np.array(data1)
features = data1[:, :-1]
features = np.array(features).astype(np.int)
labels = extractDigits(labels)
labels = np.array(labels).astype(np.int)

y = labels 
X = features
print(y.shape)
print(X.shape)
print(y)


selector = RoughSetsSelector()
X_selected = selector.fit(X, y).transform(X)

print(X_selected)