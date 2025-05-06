// Première route permets de lire les données de la base de données
// c'est la route GET

import { PrismaClient } from "@/generated/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

const prisma = new PrismaClient
export async function GET(request: Request) {
    try{

        const employees = await prisma.employes.findMany();

        return NextResponse.json(employees, {status:200})

    }catch(error){

        return NextResponse.json({error : "Failed to fetch employees"}, {status:500})

    }
}

// Fonction pour ajouter un nouvelle employé

export async function POST(request:Request) {
    try{
        const {firstName, lastName, email, position} = await request.json()

        // Vérifier que l'email est une chaine de caractère valide
        if(!email || typeof email !== 'string'){
            return NextResponse.json({error: 'Eamail is required and must be a string'}, {status:400});
        }

        // Créer un nouvel employé avec prisma
        const newEmployee = await prisma.employes.create({
            data: { firstName, lastName, email, position}
        })

        return NextResponse.json(newEmployee, {status:201});
    }catch(error){
        console.error('Failed to create employee:', error);
        // retourner une réponse d'erreur avec un statut 500 en cas d'echec
        return NextResponse.json({error: 'Failed to create employee' }, { status : 500 })
    }
}

// Modifier un employé dans la base de donnée 

export async function PATCH(request: Request) {
    try {
        const { id, ...data } = await request.json();

        if (!id || typeof id !== 'number') {
            return NextResponse.json({error: 'ID is required and must be a number' }, { status: 400 })
        }

        const updatedEmployee = await prisma.employes.update({
            where: {id},
            data,
        })

        return NextResponse.json(updatedEmployee, {status:200})
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 })
    }
}

// la suppression des éléments dans la base de donnée 

export async function DELETE (request: Request) {
    try {
        const { id } = await request.json();

        if (!id || typeof id !=='number') {
                return NextResponse.json({ error: 'ID is required and must be a number'}, {status: 400})
            }

            const deletedEmployee = await prisma.employes.delete({
                where: { id },
            })

            return NextResponse.json(deletedEmployee, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete employee' }, {status:500})
    }
}