"use client"
import { fetchtodo } from '@/actiions/auth';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const Todo = () => {
    //  const info = useQuery({ queryKey: ['todos'], queryFn: async () => {
    //     const result = await fetchtodo();
    //     return result;
    //  }})
    //     console.log(info);
    return (
        <div>
            <h2>Todo Item</h2>
            <p>Description of the todo item.</p>

        </div>
    );
};

export default Todo;