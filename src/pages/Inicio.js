import React, { useState } from "react";
import { IonPage, IonContent, IonText } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useApp } from "../app/context/AppContext";
import { Button, Input } from "../components/ui";

export default function Inicio() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const { guardarUsuario } = useApp();
  const history = useHistory();

  const guardar = () => {
    if (!nombre.trim()) {
      setError("Por favor ingrese su nombre.");
      return;
    }
    setError("");
    guardarUsuario(nombre.trim());
    history.push("/principal");
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding inicio-fondo">
        <div className="header-principal">
          <img
            src="/imagenes/logo.png.png"
            alt="AhorrApp logo"
            className="logo-app"
          />
        </div>
        <div className="inicio-contenedor">
          <div className="ahorr-card inicio-card">
            <h1 className="inicio-titulo">Bienvenido</h1>

            <IonText className="inicio-texto">
              Ingrese su nombre
            </IonText>

            <div className="inicio-input-contenedor">
              <Input
                label="Nombre"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (error) setError("");
                }}
                error={error}
                autoComplete="name"
              />
            </div>

            <Button variant="primary" block onClick={guardar}>
              Guardar y continuar
            </Button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
