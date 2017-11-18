import twitter
api = twitter.Api(consumer_key='hTcFEMjomXMp4trlezKKUZnhE',
                  consumer_secret='S7UuHib7V55uxDoIpIUkaKA97MNPaw6bBw0HK89rldJSouWX8H',
                  access_token_key='2415102446-sWpOy7KufYh1xaPq8pBajYZmUv8Ag4kYYqsusGG',
                  access_token_secret='O7I2jOsnGQmcA0VDzfXoGqhBrcFDqk8gLBAr1ccRk0n1o')

status = api.PostUpdate('tesuto tesuto')