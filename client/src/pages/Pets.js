import React, {useState} from 'react'
import gql from 'graphql-tag'
import {useQuery, useMutation} from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const ALL_PETS = gql`
    query AllPets {
        pets {
            id
            name
            type
            img
        }
    }
`

const NEW_PAT = gql`
    mutation createAPet ($newPet: NewPetInput!) {
        addPet(input: $newPet){
            id
            type
            name
            img
        }
    }
`

export default function Pets() {
    const [modal, setModal] = useState(false)
    const {data, loading, error} = useQuery(ALL_PETS)
    const [createPet, newPet] = useMutation(NEW_PAT, {
        update(cache, {data: {addPet}}) {
                const data = cache.readQuery({query: ALL_PETS})
                cache.writeQuery({
                    query: ALL_PETS,
                    data: { pets: [addPet, ...data.pets]}
                })
        }
    })

    const onSubmit = input => {
        createPet({
            variables: {
                newPet: input
            }
        })
        setModal(false)
    }

    if (modal) {
        return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)}/>
    }

    if (loading || newPet.loading) {
        return <Loader/>
    }

    if (error || newPet.error) {
        return <p>error</p>
    }

    return (
        <div className="page pets-page">
            <section>
                <div className="row betwee-xs middle-xs">
                    <div className="col-xs-10">
                        <h1>Pets</h1>
                    </div>

                    <div className="col-xs-2">
                        <button onClick={() => setModal(true)}>new pet</button>
                    </div>
                </div>
            </section>
            <section>
                <PetsList pets={data.pets}/>
            </section>
        </div>
    )
}
