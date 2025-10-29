import { fireEvent, render, screen } from "@testing-library/react"
import Card from "./Card"
import { beforeEach, vi } from "vitest"

describe("Testing Card", ()=>{
    //Crear constantes que me servirán para realizar pruebas:
    const mockCard = {
        numero: "132",
        titulo: "Ditto",
        contenido: "Pokemon que cambia",
        imagen: "ditto.jpg"
    }
    const mockModificar = vi.fn()
    const mockEliminar = vi.fn()

    beforeEach(()=>{
        vi.clearAllMocks()
    })

    it("CP-Card1: Muestra el título, contenido y número correctamente", ()=>{
        render( <Card {...mockCard}
                      modificar={mockModificar}
                      eliminar={mockEliminar} /> )
        expect(screen.getByText("Ditto")).toBeInTheDocument()
        expect(screen.getByText(/Pokemon que cambia/)).toBeInTheDocument()
        expect(screen.getByText(/132/)).toBeInTheDocument()
    })

    it("CP-Card2: Debe mostrar la imagen con el src y alt correctos", ()=>{
        render( <Card {...mockCard}
                      modificar={mockModificar}
                      eliminar={mockEliminar} /> )
        
        const img = screen.getByRole("img")
        expect(img).toHaveAttribute("src","ditto.jpg")
        expect(img).toHaveAttribute("alt","Ditto")
    })

    it("CP-Card3: Debe llamar a eliminar al hacer clic en el botón correspondiente", ()=>{
        render( <Card {...mockCard}
                      modificar={mockModificar}
                      eliminar={mockEliminar} /> )
        
        const btnEliminar = screen.getByRole("button",{name:/eliminar/i})
        fireEvent.click(btnEliminar)
        expect(mockEliminar).toHaveBeenCalledTimes(1)
    })

    it("CP-Card4: Debe llamar a modificar al hacer clic en el botón correspondiente", ()=>{
        render( <Card {...mockCard}
                      modificar={mockModificar}
                      eliminar={mockEliminar} /> )
        
        const btnModificar = screen.getByRole("button",{name:/editar/i})
        fireEvent.click(btnModificar)
        expect(mockModificar).toHaveBeenCalledTimes(1)
    })

    it("CP-Card5: Debe renderizar aunque falte la imagen", ()=>{
        render( <Card {...mockCard}
                      imagen=""
                      modificar={mockModificar}
                      eliminar={mockEliminar} /> )
        
        const img = screen.queryByRole("img")
        expect(img).not.toBeInTheDocument()
    })
    
    it("CP-Card6: No debe fallar si no se pasan funciones eliminar o modificar", ()=>{
        render( <Card {...mockCard} /> )
        expect(screen.getByText("Ditto")).toBeInTheDocument()
    })
})