
var scatterStore = null

export const getScatter = () => new Promise(resolve => 
    {
        if (scatterStore) {
            console.info('Scatter Plugin Loaded!')
            resolve(scatterStore)
        } else {
            document.addEventListener('scatterLoaded', scatterExtension => {
                if (window.scatter) {
                    console.info('Scatter Plugin Found! Loading...')
                    scatterStore = window.scatter
                    resolve(window.scatter)
                    window.scatter = null
                }
            })
        }
    })

export const fetchIdentity = async () => 
{
    if (scatterStore === null) {
        await getScatter
    }
    return scatterStore.identity
}

